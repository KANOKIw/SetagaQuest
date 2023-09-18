from . import QuizErrors
from .SQcls import QuizInfo
from .enums import numbers

__all__ = (
    "QuizInfo",
)

class ProcessQuiz():
    """|coro|
    class of a quizinfo object process
    
    Parameters
    -----------
    object: :class:`dict`

    Returns
    --------
    :class:`None`

    Raises
    -------
    NoSelectionMatchesAnswer
        answer didn't match any selection in the quizinfo object
    AssertionError
        given object class was not :class:`QuizInfo`
    """

    def __init__(self, object: QuizInfo, fp: str = ..., *arg) -> None:
        try:
            assert object.__class__ != str, "object must be type of str at least"
            
        except Exception:
            raise QuizErrors.UnsupportedObjectError("object must be type of QuizInfo")
        
        self.object = object
        self.fp = fp if fp else None


    @staticmethod
    def _do_scan(object: dict[str, str] | QuizInfo, *, v: int | float = 0) -> None:
        """|coro|
        scan a quizinfo object
        
        Parameters
        -----------
        object: :class:`dict` = ...

        Returns
        --------
        :class:`None`

        Raises
        -------
        NoSelectionMatchesAnswer
            answer didn't match any selection in the quizinfo object
        AssertionError
            quizinfo object class was not :class:`dict`
        """

        if not object.__class__ == dict:
            raise QuizErrors.UnsupportedObjectError("object must be type of dict")
        
        assert object.__class__ == dict, "object class type must be dict"

        for k in object.keys():
            try:
                answer = object[k]['answer']
                                
            except (KeyError, TypeError):
                continue

            else:
                try:
                    object[k].keys()

                except AttributeError:
                    continue
                
                if object[k].get("tof", None): continue

                for x in object[k].keys():
                    if object[k][x] == answer:
                        if x != 'answer':
                            v += 1
                if v != 1:
                    raise QuizErrors.NoSelectionMatchesAnswer(f"Where is the answer definition: in {k}")
                
                v = 0
    
    def get_path(self, object: dict[str, str] | QuizInfo = ..., *, h: int | float = 1) -> str:
        """|coro|
        by scanning object return a fp
        returned fp won't match any fp already exists

        Parameters
        -----------
        object: :class:`dict` = ...
            quizinfo object.
        v: :class:`int` = MISSING = 1
            latest quiz info number.
        Returns
        --------
        fp: :class:`str`

        Raises
        -------
        NoSelectionMatchesAnswer
            answer didn't match any selection
        AssertionError
            object class was not :class:`dict`
        """

        if not object == Ellipsis:
            self.object = object

        self._do_scan(self.object)

        while True:
            try:
                with open(f"./item/quizinfo-{h}.json"):
                    h += 1
            except Exception:
                if h > 30:
                    continue
                break
        
        self.fp = f"./item/quizinfo-{h}.json"
        return self.fp
    