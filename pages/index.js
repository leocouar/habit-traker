import Image from 'next/image'
import { Inter } from 'next/font/google'
import ListHabits from '@/components/habits/ListHabits'
import { UserAuth } from "@/context/AuthContext";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { user } = UserAuth();
  return (
    <main className='flex justify-center bg-gray-200 h-screen'>
      {!user
        ?
        (<>
          <section className="bg-gray-200 w-full h-screen flex items-center justify-center">

            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Bienvenido</h1>
            </div>

          </section>
        </>)
        :
        <section className="bg-gray-200 w-full h-auto flex justify-center">
          <ListHabits></ListHabits>
        </section>
      }

    </main>
  )
}
