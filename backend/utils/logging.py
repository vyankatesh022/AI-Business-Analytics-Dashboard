import logging
import re
import sys


# Patterns to match sensitive parameters in logs
SENSITIVE_PATTERNS = [
    r'(?i)(api_key|secret|password|token|private_key|auth|db_url)\s*[:=]\s*[\'"]?([a-zA-Z0-9_\-\.\/]{10,})[\'"]?',
    r'(?i)(Bearer\s+)([a-zA-Z0-9_\-\.\/]{10,})']


class SecretMaskingFormatter(logging.Formatter):
    """Custom logging formatter masking credentials and keys using compiled regexes."""

    def __init__(self, fmt: str = None, datefmt: str = None) -> None:
        super().__init__(fmt, datefmt)
        self.compiled_patterns = [re.compile(p) for p in SENSITIVE_PATTERNS]

    def _mask_secrets(self, text: str) -> str:
        for pattern in self.compiled_patterns:
            # We match the entire key-value pattern and mask only the value
            # component
            text = pattern.sub(
                lambda m: self._replace_sensitive_group(m), text)
        return text

    def _replace_sensitive_group(self, match: re.Match) -> str:
        groups = match.groups()
        if len(groups) >= 2:
            val = groups[1]
            masked_val = val[:4] + "********" if len(val) > 4 else "********"
            # Return string retaining original syntax prefix
            original = match.group(0)
            return original.replace(val, masked_val)
        return "********"

    def format(self, record: logging.LogRecord) -> str:
        formatted = super().format(record)
        return self._mask_secrets(formatted)


def setup_logger(name: str = "app") -> logging.Logger:
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)

    # Configure unified standard stream output handler
    handler = logging.StreamHandler(sys.stdout)
    formatter = SecretMaskingFormatter(
        fmt="%(asctime)s [%(levelname)s] (%(name)s) - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    # Ensure logs do not double bubble up
    logger.propagate = False
    return logger


logger = setup_logger()
