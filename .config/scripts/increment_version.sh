#!/bin/bash

# Read the current version
version=$(cat version.txt)

# Split the version by '.'
IFS='.' read -ra parts <<< "$version"

# Get the last commit message
commit_message=$(git log -1 --pretty=%B)

# Check if the commit message starts with 'feat:'
if [[ $commit_message == feat:* ]]; then
    # Increment the minor version
    parts[1]=$((parts[1] + 1))
    # Reset the patch version
    parts[2]=0
else
    # Increment the patch version
    parts[2]=$((parts[2] + 1))
fi

# If the last part is 10, set it to 0 and increment the second part
if (( parts[2] == 10 )); then
    parts[2]=0
    parts[1]=$((parts[1] + 1))
fi

# If the second part is 10, set it to 0 and increment the first part
if (( parts[1] == 10 )); then
    parts[1]=0
    parts[0]=$((parts[0] + 1))
fi

# Write the new version back to the file
echo "${parts[0]}.${parts[1]}.${parts[2]}" > version.txt