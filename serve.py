import os, http.server
os.chdir('/Users/admin/Documents/GitHub/Activa90')
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=8080, bind='127.0.0.1')
