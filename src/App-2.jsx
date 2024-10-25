import {useState} from "react";

function App2() {
  const [axis, setAxis] = useState({ x: 5, y: 5 });

  const x = new Array(axis.x).fill(0);
  const y = new Array(axis.y).fill(0);

  function handleMouseEnter(e, i, j) {
    console.log(`x: ${i}; y: ${j}`);
  }

  function handleInputChange(e) {
    console.log(e);

    setAxis({
      ...axis,
      [e.target.name]: Number(e.target.value)
    });
  };

  return (<>
      <div className="form">
        <input type="number" value={axis.x} onChange={(e) => handleInputChange(e)} name="x" placeholder="X field"/>
        <input type="number" value={axis.y} onChange={(e) => handleInputChange(e)} name="y" placeholder="Y field"/>
      </div>


      <div className="board">
        {x.map((_, i) => <div key={i} className="x-block">
          {y.map((__, j) => <div key={j} onMouseEnter={(e) =>
            handleMouseEnter(e, i, j)} className={`y-block ${(i + j) % 2 ? 'odd' : 'even'}`}>x: {i}; y: {j}</div>)}
        </div>)}
      </div>
    </>
  )
}

//

export default App2;
