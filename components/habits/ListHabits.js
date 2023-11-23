import { useState, useEffect } from "react";
import AddHabit from "./AddHabit";
import { db } from '../Firebase';
import { getDocs, setDoc, doc, collection, query, where, getDoc, deleteDoc } from 'firebase/firestore';
import { UserAuth } from "@/context/AuthContext";

const ListHabits = () => {
    const { user } = UserAuth();
    const [habits, setHabits] = useState([])


    const loadHabits = async () => {
        try {
            const habitsSnapshot = query(collection(db, 'habits'), where("userId", "==", user.uid));//Query
            const q = await getDocs(habitsSnapshot);
            const tempResultList = [];
            q.forEach((doc) => {
                tempResultList.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setHabits(tempResultList);
        } catch (error) {
            console.error('Error al cargar la lista de hábitos desde Firebase:', error);
        }
    };

    useEffect(() => {
        // Función para cargar la lista de hábitos desde Firebase

        // Llama a la función para cargar hábitos cuando el componente se monta o se actualiza
        loadHabits();
    }, []);

    useEffect(() => {
        // Este efecto se ejecutará cada vez que habits cambie, es decir, cuando se agregue un nuevo hábito
    }, [habits]);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'habits', id));
        loadHabits()
    }

    const handleCheckboxChange = async (habitId, completed) => {
        try {
            const habitRef = doc(db, 'habits', habitId);
            const habitDoc = await getDoc(habitRef);
            const habitData = habitDoc.data();
    
            // Asegúrate de que history esté inicializado como un array
            habitData.history = habitData.history || [];
    
            // Obtener la fecha actual en formato "AAAA-MM-DD"
            const currentDate = new Date().toISOString().split('T')[0];
    
            // Buscar si ya existe un registro para la fecha actual en el historial
            const todayEntryIndex = habitData.history.findIndex(entry => entry.date === currentDate);
    
            if (todayEntryIndex !== -1) {
                // Si ya existe un registro para el día actual, cambiar su estado completed
                habitData.history[todayEntryIndex].completed = completed;
            } else {
                // Si no existe un registro para el día actual, agregar uno nuevo con el número de días
                const daysSinceStart = Math.ceil((new Date(currentDate) - new Date(habitData.startDate)) / (24 * 60 * 60 * 1000)) + 1;
                habitData.history.push({ date: currentDate, completed: completed, daysSinceStart: daysSinceStart });
    
                // Llenar días intermedios con registros con completed establecido en false
                const sortedHistory = habitData.history.sort((a, b) => new Date(a.date) - new Date(b.date));
                for (let i = 1; i < sortedHistory.length; i++) {
                    const prevDate = sortedHistory[i - 1].date;
                    const currentDate = sortedHistory[i].date;
    
                    const daysDifference = (new Date(currentDate) - new Date(prevDate)) / (24 * 60 * 60 * 1000);
    
                    for (let j = 1; j < daysDifference; j++) {
                        const intermediateDate = new Date(new Date(prevDate).getTime() + j * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const intermediateDaysSinceStart = sortedHistory[i - 1].daysSinceStart + 1;
                        habitData.history.push({ date: intermediateDate, completed: false, daysSinceStart: intermediateDaysSinceStart });
                    }
                }
    
                // Volver a ordenar el historial después de agregar nuevos registros
                habitData.history.sort((a, b) => new Date(a.date) - new Date(b.date));
            }
    
            // Actualizar el documento en la base de datos
            await setDoc(habitRef, habitData);
    
            // Cambiar el estado del checkbox para reflejar el estado actual
            // Puedes utilizar el estado local o un mecanismo similar para manejar el estado del checkbox en React
            // Ejemplo: setCheckboxState(completed);
    
            // Volver a cargar la lista de hábitos después de la actualización
            loadHabits();
        } catch (error) {
            console.error('Error al cambiar el estado del progreso del hábito:', error);
        }
    };
    return (
        <>
            <div className="bg-white w-full mt-10 p-10 lg:w-1/2 rounded-xl h-full overflow-x-auto">
                <div className="w-full flex mt-10 justify-end">
                    <AddHabit reset={loadHabits()} />
                </div>

                <table className="table w-full transition ease-in-out">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                            </th>
                            <th>Habit</th>
                            <th>Progreso</th>
                            <th>Acction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map((habit) => (
                            <tr key={habit.id}>
                                <th>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={habit.data.history.length > 0 && habit.data.history[habit.data.history.length - 1]?.completed}
                                            onChange={(e) => handleCheckboxChange(habit.id, e.target.checked)}
                                            className="checkbox checkbox-success cursor-pointer"
                                        />
                                    </label>
                                </th>
                                <td>
                                    <div className="flex items-between gap-3">
                                        <div>
                                            <div className="font-bold">{habit.data.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <ul className="steps flex justify-end overflow-x-hidden w-96">
                                        {habit.data.history.map((step, index) => (
                                            <li key={index} className={`step ${step.completed ? 'step-success' : ''}`}>
                                                Day {index + 1}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(habit.id)} className="btn btn-error btn-circle m-2 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default ListHabits;