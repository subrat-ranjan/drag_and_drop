import { Center, Container, Flex, Heading, List, Stack, Wrap, WrapItem } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import ImageData from "./api/mock.image.json"
import Image from "./components/Image";
import './App.css';

function App() {

  const [open, setOpen] = useState(false)
  const dragImage = useRef(0);
  const draggedOverImage = useRef(0);

  function handleSort() {
    const ImageClone = [...team];
    const temp = ImageClone[dragImage.current];
    ImageClone[dragImage.current] = ImageClone[draggedOverImage.current];
    ImageClone[draggedOverImage.current] = temp;
    setTeam(ImageClone);
  }

  const [images, setImages] = useState(() => {
    const storedImages = localStorage.getItem('images');
    return storedImages ? JSON.parse(storedImages) : ImageData;
  });

  const [team, setTeam] = useState(() => {
    const storedTeam = localStorage.getItem('team');
    return storedTeam ? JSON.parse(storedTeam) : [];
  });
  useEffect(() => {
    localStorage.setItem('team', JSON.stringify(team));
  }, [team]);

  const [{ isOver }, addToTeamRef] = useDrop({
    accept: "module",
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    drop: (item) => movePlayerToTeam(item),
  });

  console.log(isOver);
  const [{ isOver: isPlayerOver }, removeFromTeamRef] = useDrop({
    accept: "dashboard",
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    drop: (item) => removePlayerFromTeam(item),
  });

  const movePlayerToTeam = (item) => {
    const newImages = images.filter((_, i) => item.index !== i);
    const newTeam = [...team, item];
    setImages(newImages);
    setTeam(newTeam);
    localStorage.setItem('images', JSON.stringify(newImages));
    localStorage.setItem('team', JSON.stringify(newTeam));
  };

  const removePlayerFromTeam = (item) => {
    const newTeam = team.filter((_, i) => item.index !== i);
    const newImages = [...images, item];
    setTeam(newTeam);
    setImages(newImages);
    localStorage.setItem('images', JSON.stringify(newImages));
    localStorage.setItem('team', JSON.stringify(newTeam));
  };


  return (
    <>
      <div className="mainContainer">
        <div className="container" maxW="300px">
          <h1>
            React Drag & Drop
          </h1>
          <div className="burger" onClick={() => setOpen(!open)}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          {open && (
            <div className="responsiveModule" ref={removeFromTeamRef}>
              <div className="resContainer">
                {images.map((p, i) => (
                  <Image
                    item={p}
                    key={i}
                    playerType="module"
                    onDropPlayer={movePlayerToTeam}
                    index={i}
                  />
                ))}
              </div>
            </div>

          )}
        </div>



        <div className="container">
          <div className="left">
            <h2> Module Images</h2>
            <div className="listContainer" ref={removeFromTeamRef}>
              <div className="imageContainer" >
                <Wrap spacing="10px" justify="center" >
                  {images.map((p, i) => (
                    <WrapItem key={i}>
                      <Image
                        item={p}
                        key={i}
                        playerType="module"

                        onDropPlayer={movePlayerToTeam}
                        index={i}
                      />
                    </WrapItem>
                  ))}
                </Wrap>

              </div>
            </div>
          </div>
          <div className="right">
            <h2>Drag and Drop here</h2>
            <div className="listContainer" ref={addToTeamRef} >
              <div className="imageContainer" >
                <Wrap spacing="10px" justify="center"  >


                  {team.map((p, i) => (

                    <WrapItem
                      key={i}
                      draggable
                      onDragStart={() => (dragImage.current = i)}
                      onDragEnter={() => (draggedOverImage.current = i)}
                      onDragEnd={handleSort}
                      onDragOver={(e) => e.preventDefault()}
                      cursor="grab"

                    >
                      <Image

                        item={p}
                        key={i}
                        playerType="dashboard"

                        onDropPlayer={removePlayerFromTeam}
                        index={i}
                      />
                    </WrapItem>
                  ))}
                </Wrap>
              </div>
            </div>
          </div>
        </div>
      </div >

    </>
  );
}


export default App;
