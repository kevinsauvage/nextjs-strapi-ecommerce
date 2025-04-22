export function GET() {
  return new Response('Authentication Required!', {
    headers: {
      'WWW-Authenticate': "Basic realm='private_pages'",
    },
    status: 401,
  });
}
