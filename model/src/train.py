from pathlib import Path


def train(data_dir: Path, output_dir: Path) -> None:
    """Placeholder training entry point; replace with the approved research pipeline."""
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "README.txt").write_text(f"Training scaffold; source data: {data_dir}\n")


if __name__ == "__main__":
    train(Path("sample-data"), Path("model/checkpoints"))
