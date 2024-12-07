import Link from "next/link";
import { Button } from "react-bootstrap";

export default function Header() {
  return (
    <>
      <header className="bg-cover text-center" style={{height: '60vh',
                                           backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(recycling.jpg)',
                                           backgroundSize: 'cover'}}>
        <h1 className="text-white fw-bold display-1 pt-5"
            style={{textShadow: '0 0 6px rgba(0, 0, 0, 0.5)', opacity: 0.9}}>Empresa Verde</h1>
        <p className="text-white display-6 pb-5">Sistema de certificação ambiental</p>
        <Link href="/register" passHref legacyBehavior className="mt-5">
          <Button variant="primary"
                  className="btn-lg mt-5 mx-4">
            Registrar-se
          </Button>
        </Link>
      </header>
    </>
  )
}
