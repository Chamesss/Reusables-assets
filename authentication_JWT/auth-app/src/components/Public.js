import { Link } from "react-router-dom";

const Public = () => {
    const content = (
        <section>
            <header>
                <h1>Main page</h1>
            </header>
            <main>
                <p>This is main paragraph</p>
                <p>&nbsp;</p>
            </main>
            <footer>
                <Link to='/login'>User login here !</Link>
            </footer>
        </section>
    )
    return content
}

export default Public