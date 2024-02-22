import React from 'react'
import { useDrag } from "react-dnd";
import './image.css';

const Image = ({ item, playerType, onDropPlayer, index }) => {

    const [{ isDragging }, dragRef] = useDrag({
        type: playerType,
        item: () => ({ ...item, index }),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();

            if (item && dropResult) {
                onDropPlayer(item);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),

    });


    return (
        <div className='images' ref={dragRef}
        >
            <img
                style={{
                    backgroundColor: isDragging ? (playerType === 'player' ? 'yellow' : 'teal') : 'white',
                    color: isDragging ? 'white' : 'black',
                }}
                src={item.image}
                alt={item.id}
                ref={dragRef}
            />
        </div>
    )
}

export default Image