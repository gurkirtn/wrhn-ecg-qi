from pathlib import Path
import sqlite3


def main() -> None:
    with sqlite3.connect(Path("ecgqi.db")) as connection:
        connection.executescript(Path("database/schema.sql").read_text())
        connection.executescript(Path("database/seed.sql").read_text())
    print("Demo clinician, expert, and dual-role users are ready")


if __name__ == "__main__":
    main()
