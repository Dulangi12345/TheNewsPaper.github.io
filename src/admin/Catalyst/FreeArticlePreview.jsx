import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const FreeArticlePreview = () => {
    const location = useLocation();
    const { title , content , image1 , image2 , image3  } = location.state;
    const paragraphs = content.split('\n\n');
    const backButton = () => {
        const navigate = useNavigate();

        return (

            <button onClick={
                () => navigate(-1)
            }>
                go back

            </button>
        )
            
    }
    return (
        <div>
            <h1>{title}</h1>
            <div className=' mb-10 mt-16'>
                {paragraphs.map((paragraph, index) => {
                    return <p key={index}>{paragraph}</p>
                })}
            </div>
            <div>
                <img src={image1} alt="article image" />
            </div>
            <div>
                <img src={image2} alt="article image" />
            </div>
            <div>
                <img src={image3} alt="article image" />
            </div>

           
            <div>
                {backButton()}
            </div>

        
        </div>
    );
};

export default FreeArticlePreview;
