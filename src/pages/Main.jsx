import React from 'react';
import Title from '../components/Title';
import TipApplication from '../components/TipApplication';
import {useAuthStore} from '../components/store/store';
import CategoriesList from '../components/course/CategoriesList';
import TitleCatalog from "../components/TitleCatalog";

const Main = () => {
    const authStore = useAuthStore();
    return (
        <div>
            {authStore?.authenticated === true ? (
                <div className="courses-catalog-container">
                    <CategoriesList/>
                </div>
            ) : (
                <div>
                    <Title/>

                    <TitleCatalog/>

                    <TipApplication/>
                </div>
            )}
        </div>
    );
};

export default Main;
