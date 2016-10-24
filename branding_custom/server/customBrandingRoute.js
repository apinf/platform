Router.route('customStyle', {
  where: 'server',
  path: '/custom.style.css',
  action () {
    const css = `color: #123`;
    const headers = { 'Content-type': 'text/css' };
    this.response.writeHead(200, headers);
    this.response.end(css);
  },
});
