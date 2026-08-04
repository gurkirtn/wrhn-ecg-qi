from pathlib import Path


def main() -> None:
    database_path = Path("ecgqi.db")
    if database_path.exists():
        database_path.unlink()
    print("Local demo database reset")


if __name__ == "__main__":
    main()
