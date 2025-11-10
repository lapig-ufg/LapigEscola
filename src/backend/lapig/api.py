from ninja import NinjaAPI
from escola.api.bioma import router as bioma_router
from escola.api.pages import router as pages_router
from escola.api.map import router as map_router



api = NinjaAPI()


api.add_router("bioma/", bioma_router)
api.add_router("pages/", pages_router)
api.add_router("maps/", map_router)
