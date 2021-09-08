import React, { useState } from "react";
import { useRouter } from "next/router";

//   --- COMPONENTS ---
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";

interface Data {
  id: String;
  task: Number;
  done: Boolean;
  data: Array<{ id: String; task: Number; done: Boolean }>;
}

//   --- STYLES ---
const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const BodyOfTable = ({ id, task, done, data }: Data) => {
  const [edit, setEdit] = useState(false);
  const [check, setCheck] = useState("");
  const [uptade, setUptade] = useState({
    id: "",
    task: "",
    done: false,
  });

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCheck(event.target.value);
    setUptade({ ...uptade, done: event.target.value });
  };

  const handleEdit = () => {
    setEdit(!edit);
    setUptade({
      ...uptade,
      id: id,
      task: task,
    });
  };

  const handleDelete = async (event: React.MouseEvent) => {
    const response = await fetch("http://localhost:3000/list", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    event.preventDefault();
    router.replace(router.asPath);
    return await response.json();
  };

  const handleSave = async (event: React.MouseEvent) => {
    const response = await fetch("http://localhost:3000/list", {
      method: "PUT",
      body: JSON.stringify(uptade),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data.map((element) => {
      if (element.done === true) {
        console.log(element);
      }
    });

    setEdit(!edit);
    event.preventDefault();
    router.replace(router.asPath);
    return await response.json();
  };

  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        {task}
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormControlLabel
          className={!edit ? "" : "display"}
          control={<Checkbox checked={done as boolean} />}
        />
        <InputLabel
          className={edit ? "" : "display"}
          id="demo-simple-select-label"
        >
          Done
        </InputLabel>
        <Select
          className={edit ? "" : "display"}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={check}
          onChange={(event) => handleChange(event)}
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </Select>
      </StyledTableCell>
      <StyledTableCell align="right">
        <Button variant="contained" color="secondary" onClick={handleEdit}>
          Edit
        </Button>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={(event) => handleDelete(event)}
        >
          Delete
        </Button>
      </StyledTableCell>
      <StyledTableCell align="right">
        <Button
          className={edit ? "" : "display"}
          variant="contained"
          color="secondary"
          onClick={(event) => handleSave(event)}
        >
          Save
        </Button>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default BodyOfTable;
