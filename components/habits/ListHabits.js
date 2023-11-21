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

    const handleAddProgress = async (habitId) => {
        try {
            const habitRef = doc(db, 'habits', habitId);
            const habitDoc = await getDoc(habitRef);
            const habitData = habitDoc.data();

            // Obtener la fecha actual en formato "AAAA-MM-DD"
            const currentDate = new Date().toISOString().split('T')[0];

            // Agregar el progreso al historial del hábito
            habitData.history.push({ date: currentDate, completed: true });

            // Actualizar el documento en la base de datos
            await setDoc(habitRef, habitData);

            // Volver a cargar la lista de hábitos después de la actualización
            loadHabits();
        } catch (error) {
            console.error('Error al agregar progreso al hábito:', error);
        }
    };

    const handleCheckboxChange = async (habitId, index, completed) => {
        try {
          const habitRef = doc(db, 'habits', habitId);
          const habitDoc = await getDoc(habitRef);
          const habitData = habitDoc.data();
      
          if (!habitData.history) {
            // Si el historial no está definido, créalo como un array vacío
            habitData.history = [];
          }
      
          // Asegúrate de que haya suficientes elementos en el historial hasta el índice que estás modificando
          for (let i = habitData.history.length; i <= index; i++) {
            habitData.history.push({ completed: false });
          }
      
          // Cambiar el estado del progreso en el historial del hábito
          habitData.history[index].completed = !completed;
      
          // Actualizar el documento en la base de datos
          await setDoc(habitRef, habitData);
      
          // Volver a cargar la lista de hábitos después de la actualización
          loadHabits();
        } catch (error) {
          console.error('Error al cambiar el estado del progreso del hábito:', error);
        }
      };

    return (
        <>
            <div className="bg-white mt-10 p-10 rounded-xl overflow-x-auto">
                <div className="w-full flex mt-10 justify-end">
                    <AddHabit reset={loadHabits()} />
                </div>

                <table className="table p-10 w-1/2 transition ease-in-out">
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
                                            onChange={() => handleCheckboxChange(habit.id, habit.data.history.length - 1, habit.data.history[habit.data.history.length - 1]?.completed)}
                                            className="checkbox checkbox-success"
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
                                    <ul className="steps">
                                        <li className="step step-success">Day 1</li>
                                        <li className="step step-success">Day 2</li>
                                        <li className="step">Day 3</li>
                                        <li className="step">Day 4</li>
                                        <li className="step">Day 5</li>
                                        <li className="step">Day 6</li>
                                        <li className="step">Day 7</li>
                                    </ul>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(habit.id)} className="btn btn-error btn-circle m-2">
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