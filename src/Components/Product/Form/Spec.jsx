import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Remove } from "../../../assets/IconSet";
import PropTypes from "prop-types";

export default function Spec({
  specifications,
  handleGroupTitleChange,
  handleSpecChange,
  removeItem,
  addItem,
  removeGroup,
  addGroup,
}) {
  const cardStyle = {
    mb: 4,
    borderRadius: 3,
    boxShadow:
      "0 0 2px 0 rgba(145 158 171 / 20%), 0 12px 24px -4px rgba(145 158 171 / 12%)",
  };
  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          Specifications
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Product features, additional functions and attributes...
        </Typography>
        {specifications.map((group, groupIndex) => (
          <Card key={groupIndex} sx={{ p: 3, mb: 3 }} variant="outlined">
            <TextField
              fullWidth
              label="Group Title"
              value={group.groupTitle}
              onChange={(e) =>
                handleGroupTitleChange(groupIndex, e.target.value)
              }
              sx={{ mb: 2 }}
            />

            {group.items.map((item, itemIndex) => (
              <Grid container spacing={2} key={itemIndex} mb={1}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Label"
                    value={item.label}
                    onChange={(e) =>
                      handleSpecChange(
                        groupIndex,
                        itemIndex,
                        "label",
                        e.target.value,
                      )
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Value"
                    value={item.value}
                    onChange={(e) =>
                      handleSpecChange(
                        groupIndex,
                        itemIndex,
                        "value",
                        e.target.value,
                      )
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    color="error"
                    onClick={() => removeItem(groupIndex, itemIndex)}
                  >
                    <Remove size={"14px"} color="red" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<Plus size={"24px"} color="#792DF8" />}
              onClick={() => addItem(groupIndex)}
            >
              Add Item
            </Button>

            <Divider sx={{ my: 2 }} />

            <Button color="error" onClick={() => removeGroup(groupIndex)}>
              Remove Group
            </Button>
          </Card>
        ))}

        <Button
          startIcon={<Plus size={"24px"} color="#792DF8" />}
          onClick={addGroup}
        >
          Add Specification Group
        </Button>
      </CardContent>
    </Card>
  );
}
Spec.propTypes = {
  specifications: PropTypes.arrayOf(
    PropTypes.shape({
      groupTitle: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,

  handleGroupTitleChange: PropTypes.func.isRequired,
  handleSpecChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  removeGroup: PropTypes.func.isRequired,
  addGroup: PropTypes.func.isRequired,
};
