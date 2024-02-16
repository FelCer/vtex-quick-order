import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo';
import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql'

const QuickOrder = () => {
    const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT);
    const [addToCart] = useMutation(UPDATE_CART);
    const [inputText, setInputText] = useState("");
    const [search, setSearch] = useState("");
    const [notFoundProduct, setNotFoundProduct] = useState("");

    const handleChange = (event: any) => {
        setInputText(event.target.value)
    }

    const searchProduct = (event: any) => {
        event.preventDefault();
        if (!inputText) {
            setNotFoundProduct("No a ingresado NADA")
        } else {
            setSearch(inputText)
            getProductBySku()
        }
    }

    const updateAddToCart = (productId: string) => {
        const skuId = parseInt(productId)
        addToCart({
            variables: {
                salesChannel: "1",
                items: [
                    {
                        id: skuId,
                        quantity: 1,
                        seller: "1"
                    }
                ]
            }
        })
            .then(() => {
                window.location.href = "/checkout"
            })
    };

    const getProductBySku = () => {
        getProductData({
            variables: {
                sku: inputText
            }
        })
    };

    useEffect(() => {
        (product ? updateAddToCart(product?.product?.productId) : setNotFoundProduct('NO existe el sku, ingresado'))
    }, [search, product])

    return (
        <>
            <div>Compra super super rápida</div>
            <form onSubmit={searchProduct}>
                <div>
                    <label htmlFor="sku">Ingrese su SKU</label>
                    <input id='sku' type="text" onChange={handleChange} />
                </div>
                <input type="submit" value="AÑADIR AL CARRITO" />
            </form>
            {
                notFoundProduct && (
                    <h1>{notFoundProduct}</h1>
                )
            }
        </>
    )
};

export default QuickOrder;