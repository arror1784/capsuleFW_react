from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import post.routing

ASGI_APPLICATION = "djangoreactapi.routing.application"
application = ProtocolTypeRouter({
    # (http->django views is added by default)
	    'websocket': AuthMiddlewareStack(
        URLRouter(
            post.routing.websocket_urlpatterns
        )
    ),
})


