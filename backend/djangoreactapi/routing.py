from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import post.routing


websocket_urlpatterns = [
]

application = ProtocolTypeRouter({
    # (http->django views is added by default)
	    'websocket': AuthMiddlewareStack(
        URLRouter(
            post.routing.websocket_urlpatterns
            # websocket_urlpatterns
        )
    ),
})


