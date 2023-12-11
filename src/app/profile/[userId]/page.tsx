import Header from "@/components/header"

export default function Profile({params}: any) {
    return (
        <div>
            <Header/>
            Profile with params: {params.id}
        </div>
    )
}