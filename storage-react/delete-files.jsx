// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function deleteFile() {
  // [START storage_delete_file]
  const { useTransition } = require("react");
  const { getStorage, ref, deleteObject } = require("firebase/storage");

  function DeleteFileButton() {
    const [isPending, startTransition] = useTransition();

    function deleteFile() {
      startTransition(async () => {
        const storage = getStorage();

        // Create a reference to the file to delete
        const desertRef = ref(storage, 'images/desert.jpg');

        // Delete the file
        try {
          await deleteObject(desertRef);
          // File deleted successfully
        } catch (error) {
          // Uh-oh, an error occurred!
        }
      });
    }

    return <button onClick={deleteFile} disabled={isPending}>Delete</button>;
  }
  // [END storage_delete_file]
}
