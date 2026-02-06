
# Recipe Frontend (Repo B)

This repository stores the accumulated recipes in `data/recipes.json`. It is updated by a workflow in Repo A using the GitHub REST API **Create or update file contents** endpoint. Ensure your automation PAT (stored as `generator` secret in Repo A) has **Contents: Read & write** permission to this repository.

Initial bootstrap file:

```
data/recipes.json
```

with contents:

```json
[]
```
