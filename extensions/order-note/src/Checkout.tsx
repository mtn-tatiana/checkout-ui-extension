import {
  reactExtension,
  View,
  TextField,
  useNote,
  useApplyNoteChange
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  let note = useNote();
  const applyNoteChange = useApplyNoteChange();
  const saveNote = (noteValue: string) => {
    applyNoteChange({
      note: noteValue,
      type: 'updateNote'
    })
  }


  return (
    <View border={"none"} padding={"none"}>
        <TextField label="Note" multiline={3} onChange={saveNote} value={note}/>
    </View>
  );
}
