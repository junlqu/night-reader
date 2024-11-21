export default async function Chapter({params}) {
  const id = await params;
  console.log(id["manhua"])

  // let imgs = [];
  // try {
  //   let data = await fetch(`http://localhost:5050/${id}/chapter-${chapter}`);
  // }
  // catch (err) {
  //   console.log(err);
  // }

  return (
    <div className="wrapper">
      <p>Manhua Page</p>
    </div>
  )
}