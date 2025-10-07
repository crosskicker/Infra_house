class AppError(Exception):
    """Base class for all custom application exceptions."""
    pass


# ---- Infrastructure errors ----

class InfraError(AppError):
    """Base class for all infrastructure-related errors."""
    pass


class InfraDeployError(InfraError):
    """Raised when infrastructure deployment fails."""
    pass


class InfraDestroyError(InfraError):
    """Raised when infrastructure destruction fails."""
    pass


# ---- Database errors ----

class DatabaseError(AppError):
    """Raised when a database operation fails."""
    pass
