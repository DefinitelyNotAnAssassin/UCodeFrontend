import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom'; 



const links = [ 
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Resources', path: '/resources' },
    { name: 'Community', path: '/community' },
    { name: 'About', path: '/about' },
]


export default function Navbar(){ 


    return ( 

    <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" to="/">
            <BookOpen className="h-6 w-6 mr-2" />
            <span className="font-bold">UCode</span>
        </Link>
    <nav className="ml-auto flex gap-4 sm:gap-6">
        {links.map((link) => (
            <Link key={link.name} to={link.path} className="text-sm font-medium hover:underline underline-offset-4">
                {link.name}
            </Link>
        ))}
    </nav>
    </header>
    )
}