import {Fragment, useEffect, useState} from 'react'
import ProductCard from '../components/ProductCard'
import { useSearchParams } from 'react-router-dom';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] =  useSearchParams()

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        // Render free instances sleep; retry a few times while the server wakes up
        const load = (attempt) => {
            fetch((process.env.REACT_APP_API_URL || '/api/v1')+'/products?'+searchParams)
            .then(res => {
                if (!res.ok) throw new Error('Server returned ' + res.status);
                return res.json();
            })
            .then(res => {
                if (cancelled) return;
                setProducts(res.products || []);
                setLoading(false);
            })
            .catch(err => {
                if (cancelled) return;
                if (attempt < 4) {
                    setTimeout(() => load(attempt + 1), 3000);
                } else {
                    setError(err.message);
                    setLoading(false);
                }
            });
        };
        load(0);
        return () => { cancelled = true; };
    },[searchParams])

    return <Fragment>
        <h1 id="products_heading">Latest Products</h1>

        <section id="products" className="container mt-5">
        {loading && <p className="text-center">Loading products...</p>}
        {error && <p className="text-center text-danger">Could not load products ({error}). Please refresh the page.</p>}
        {!loading && !error && products.length === 0 && <p className="text-center">No products found.</p>}
        <div className="row">
            {products.map(product => <ProductCard key={product._id} product={product} />)} 
        </div>
        </section>
    </Fragment>
}
