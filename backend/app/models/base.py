from datetime import datetime, time

from beanie import Document
from pydantic import BaseModel as PydanticBaseModel


class BaseModel(Document):
    def to_json(self, obj: dict | PydanticBaseModel = None) -> dict:
        if isinstance(obj, PydanticBaseModel):
            obj = obj.model_dump()
        model_dump = obj or self.model_dump()
        for key, value in model_dump.items():
            if isinstance(value, (list, tuple, set, frozenset)):
                value = list(value)
            elif isinstance(value, (datetime, time)):
                value = str(value)
            elif isinstance(value, dict):
                value = self.to_json(value)
            model_dump[key] = value
        return model_dump
