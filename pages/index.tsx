import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { NextRouter, useRouter } from "next/router";

//   --- COMPONENTS ---
import Table from "../components/table/table";
import TableBody from "../components/tableBody/tableBody";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

interface Data {
  id: String;
  task: Number;
  done: Boolean;
}

const Home: NextPage = ({ data }) => {
  const [newTask, setNewTask] = useState("");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("all");

  const router: NextRouter = useRouter();

  const handlePrev = (): void => {
    setPage(page - 10);
  };
  const handleNext = (): void => {
    setPage(page + 10);
  };

  const handleNewTask = async (event: React.FormEvent<HTMLFormElement>) => {
    const response = await fetch("http://localhost:3000/list", {
      method: "POST",
      body: JSON.stringify({
        task: newTask,
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    event.preventDefault();
    setNewTask("");
    router.replace(router.asPath);
    return await response.json();
  };

  const handleRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort((event.target as HTMLInputElement).value);
  };

  return (
    <>
      <Head>
        <title>To do list</title>
      </Head>
      <h1>To do list</h1>
      <form onSubmit={(event) => handleNewTask(event)}>
        <label>
          <input
            type="text"
            placeholder="Add new task"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
        </label>
        <Button variant="contained" color="secondary" type="submit">
          New task
        </Button>
      </form>
      <FormControl component="fieldset">
        <FormLabel component="legend">Sort</FormLabel>
        <RadioGroup className="sortRadio" value={sort} onChange={handleRadio}>
          <FormControlLabel value="all" control={<Radio />} label="All" />
          <FormControlLabel value="done" control={<Radio />} label="Done" />
          <FormControlLabel
            value="not done"
            control={<Radio />}
            label="Not done"
          />
        </RadioGroup>
      </FormControl>
      <Table>
        {data
          .filter((element: Array<Data>) => {
            if (sort === "all") {
              return element;
            }
            if (sort === "done" && element.done === true) {
              return element;
            }
            if (sort === "not done" && element.done === false) {
              return element;
            }
          })
          .slice(page, page + 10)
          .map(({ id, task, done }: Data) => {
            return (
              <TableBody key={id} id={id} task={task} done={done} data={data} />
            );
          })}
      </Table>
      <Button variant="contained" color="secondary" onClick={handlePrev}>
        Prev
      </Button>
      <Button variant="contained" color="secondary" onClick={handleNext}>
        Next
      </Button>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch("http://localhost:3000/list");
  const data = await res.json();
  data.reverse();

  return {
    props: {
      data,
    },
  };
};

export default Home;
