from .enums import numbers

def overload(self) -> None: ...

class ProcessQuiz:
    def __init__(self,
        object: dict[str, str] | None,
        fp: str | None,
        v: int | float = 0,
        h: int | float = 1,
        /,
        *arg) -> None: ...
    