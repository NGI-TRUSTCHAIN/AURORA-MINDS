class CustomException(Exception):
    """
    Custom exception class to handle application-specific errors.
    """

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)
