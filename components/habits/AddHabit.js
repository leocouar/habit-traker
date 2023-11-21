// pages/add-habit.js
import React, { useState } from 'react';
import { db } from '../Firebase';
import { addDoc,setDoc,doc,collection ,Timestamp} from 'firebase/firestore';
import { data } from 'autoprefixer';
import { UserAuth } from "@/context/AuthContext";


const AddHabit = (reset) => {
    const { user } = UserAuth();
    const initialHabit = {
        name: "",
    }
    const [habit, setHabit] = useState(initialHabit);

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setHabit((habit) => ({
            ...habit,
            [name]: value,
        }));
    };

    const handleAddHabit = async (e) => {
            e.preventDefault()
            const data =await addDoc(collection(db,'habits'),{
                name: habit.name,
                creationDate: Timestamp.fromDate(new Date),
                userId:user.uid,
            }).then(
                setHabit(initialHabit)
            )   
            reset
    };

    return (
        <>
            <form onSubmit={handleAddHabit}>
                <div className="join">
                    <input value={habit.name} type='text' name='name' onChange={handleChange} className="input input-bordered join-item" placeholder="Habit" />
                    <button type="submit" className="btn join-item rounded-r-full">Crear</button>
                </div>
            </form>
        </>
    );
};

export default AddHabit;