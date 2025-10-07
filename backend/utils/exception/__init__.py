class InfraDeployError(Exception):
    """Custom exception raised when infrastructure deployment fails."""
    pass

class InfraDestroyError(Exception):
    """Custom exception raised when infrastructure destruction fails."""
    pass


class DatabaseError(Exception):
    """ Custom exception raised whena problem with the BDD occured """
    pass