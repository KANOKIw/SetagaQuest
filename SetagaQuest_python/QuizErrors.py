class QuizErrors(Exception):
    """ error occures while saving a quiz information """
    
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class NoSelectionMatchesAnswer(QuizErrors):
    """ raises if no selection matches the answer """

class UnsupportedObjectError(QuizErrors):
    """ raises when did't provided dict Object """
    