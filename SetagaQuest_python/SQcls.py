from typing import overload
from .typing import ProcessQuiz
from .enums import numbers

class QuizInfo(ProcessQuiz):
    def __init__(self, object: dict[str, str] | None, fp: str | None, v: int | float = 0, h: int | float = 1, /, *arg) -> None:
        super().__init__(object, fp, v, h, *arg)

    @overload
    def properly(self,
        *,
        object: dict[str, str] | None
        ) -> None: ...

    @overload
    def _isQuiz(self,
        object: dict[str, str],
        *,
        fp: str | list = None,
        v: int | float = 1
        ) -> None: ...
    

@overload
def get_path(self, 
    object: dict[str, str] | QuizInfo = ...,
    *,
    h: int | float = 1
    ) -> str: ...
