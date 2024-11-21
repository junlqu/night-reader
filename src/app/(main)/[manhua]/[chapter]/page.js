export default async function Chapter({params}) {
  const param = await params;
  const manhua = param["manhua"];
  const chapter = param["chapter"];

  let imgs = [];
  try {
    let data = await fetch(`http://localhost:5050/manhua/mhp/${manhua}/${chapter}`);
    imgs = await data.json();
  }
  catch (err) {
    console.log(err);
  }

  console.log(imgs);

  return (
    <div className="wrapper">
      <p>Chapter Page</p>
      {
        imgs.map((img, index) => (
          <img key={index} src={img} alt={index} />
        ))
      }
    </div>
  )
}