function isActiveRoute(req, route) {
  return req
   === route ? 'active' : '';
}

export default isActiveRoute ;
