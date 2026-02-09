export default function UserCard(){
    const name=localStorage.getItem("name")
    const email=localStorage.getItem("email")
    const role=localStorage.getItem("role")

    if(!name){
        return null
    }

   return (
    <div className="bg-white shadow-sm rounded-2xl p-5 border mb-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800">{name}</h2>
          {/* <p className="text-sm text-gray-600">{email}</p> */}
    
        </div>
      </div>
    </div>
  );
}