from pathlib import Path
import sqlite3


def main() -> None:
    database_path = Path("ecgqi.db")
    with sqlite3.connect(database_path) as connection:
        connection.executescript(Path("database/schema.sql").read_text())
        connection.executescript(Path("database/seed.sql").read_text())
    print(f"Seeded {database_path}")


if __name__ == "__main__":
    main()
