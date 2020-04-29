import React, { useContext, useEffect } from 'react'
import Proyecto from './Proyecto'
import proyectoContext from '../../context/proyectos/proyectoContext'
import AlertaContext from '../../context/alertas/alertaContext'
import { CSSTransition, TransitionGroup } from 'react-transition-group'


const ListadoProyectos = () => {

    const proyectosContext = useContext(proyectoContext)
    const { proyectos, obtenerProyectos } = proyectosContext

    const alertaContext = useContext(AlertaContext)
    const { mensaje, alert, mostrarAlerta } = alertaContext

    useEffect(() => {

        if (mensaje) {
            mostrarAlerta(mensaje.msg, mensaje.categoria)
        }

        obtenerProyectos()
        //eslint-disable-next-line
    }, [mensaje])

    if (proyectos.length === 0) return <p>No hay proyectos, crea uno</p>

    return (
        <ul className="listado-proyectos">
            {alert ? (<div className={`alerta ${alert.categoria}`}>{alert.msg}</div>) : null}
            <TransitionGroup>
                {proyectos.map(proyecto => (
                    <CSSTransition
                        key={proyecto._id}
                        timeout={200}
                        classNames="proyecto"
                    >
                        <Proyecto
                            proyecto={proyecto}
                        />
                    </CSSTransition>

                ))}
            </TransitionGroup>
        </ul>
    )
}

export default ListadoProyectos
