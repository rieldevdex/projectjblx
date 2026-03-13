export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        }
      });
    }

    // Route: /jbcl/:username — live JBCL dupe lookup
    if (url.pathname.startsWith('/jbcl/')) {
      const username = decodeURIComponent(url.pathname.replace('/jbcl/', ''));

      const robloxRes = await fetch('https://users.roblox.com/v1/usernames/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
      });
      const robloxData = await robloxRes.json();
      const userId = robloxData?.data?.[0]?.id;

      if (!userId) {
        return new Response(JSON.stringify({ dupes: [] }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      const jbclRes = await fetch(`https://jailbreakchangelogs.xyz/dupes/${userId}`, {
        headers: { 'User-Agent': 'JBLX-DupeProxy/1.0 (+https://jblx.net)' }
      });
      const html = await jbclRes.text();

      const itemRe = /href="\/item\/[^/]+\/([^"]+)"/g;
      let m;
      const seen = new Set();
      const dupes = [];
      while ((m = itemRe.exec(html)) !== null) {
        const name = decodeURIComponent(m[1]).replace(/-/g, ' ');
        if (!seen.has(name)) {
          seen.add(name);
          dupes.push({ item: name, itemKey: name.replace(/\s+/g, '_').toUpperCase() });
        }
      }

      return new Response(JSON.stringify({ dupes }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        }
      });
    }

    // Route: /:userId — Roblox user ID → username resolver
    const userId = url.pathname.replace('/', '');
    if (/^\d+$/.test(userId)) {
      const res = await fetch(`https://users.roblox.com/v1/users/${userId}`);
      const data = await res.json();
      return new Response(JSON.stringify({ name: data.name || null }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};