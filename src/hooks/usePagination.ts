import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setCurrentPage, setSearchQuery, setSelectedCategory } from '../store/recipeSlice';
import { useSearchParams } from 'react-router-dom';

const usePagination = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentPage, itemsPerPage } = useSelector((state: RootState) => state.recipes);

    // Синхронізація URL параметрів зі станом Redux при першому завантаженні
    useEffect(() => {
        const urlPage = searchParams.get('page');
        const urlQuery = searchParams.get('query');
        const urlCategory = searchParams.get('category');

        if (urlPage) dispatch(setCurrentPage(Number(urlPage)));
        if (urlQuery) dispatch(setSearchQuery(urlQuery));
        if (urlCategory) dispatch(setSelectedCategory(urlCategory));
    }, [dispatch, searchParams]);

    // Оновлення URL параметрів при зміні стану
    useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set('page', currentPage.toString());
        setSearchParams(params);
    }, [currentPage, setSearchParams]);

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
    };

    return { currentPage, itemsPerPage, handlePageChange };
};

export default usePagination;