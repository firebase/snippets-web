#!/bin/bash

# Runs `npm run compile` across all snippet directories.

echo "Starting package compilation search..."

# Iterate over all direct subdirectories (ending with /)
# The glob pattern '*/' ensures we only look at directories at this level.
for dir in */; do
    # Strip the trailing slash for cleaner output and directory path usage
    subdir="${dir%/}"

    # Check if a package.json file exists in the current subdirectory
    if [ -f "$subdir/package.json" ]; then
        echo "--> Found package.json in '$subdir'. Running 'npm run compile'..."

        # Use a subshell (parentheses) for the 'cd' command.
        # This executes 'cd' and 'npm run compile' in a separate process,
        # ensuring the main script's working directory doesn't change,
        # and the loop continues correctly from the parent path.
        if (cd "$subdir" && npm run compile); then
            echo "Successfully compiled '$subdir'."
        else
            echo "ERROR: Compilation failed for '$subdir'. Check the output above."
            exit 1
        fi
        
    else
        : # skip directories like snippets and .github
    fi
done

echo "Package compilation search complete."
