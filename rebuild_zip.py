import os
import zipfile

root = r"C:\Users\hitan\climate-gbv-ngo-site"
archive = os.path.join(root, "apply.zip")

if os.path.exists(archive):
    os.remove(archive)

with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in {"__pycache__", ".git"}]
        for filename in filenames:
            if filename in {"apply.zip", "rebuild_zip.py"}:
                continue
            full_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(full_path, root).replace("\\", "/")
            z.write(full_path, arcname=rel_path)

print("Created", archive)
with zipfile.ZipFile(archive) as z:
    print("entries", len(z.namelist()))
    print("index.html" in z.namelist())
    print("styles.css" in z.namelist())
