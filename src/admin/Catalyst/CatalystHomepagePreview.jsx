import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CatalystHomepagePreview = () => {
    const location = useLocation();
    const { title, articleContent,  articleImage} = location.state;
    const paragraphs = articleContent.split('\n\n');

    const backButton = () => {
        const navigate = useNavigate();

        return(

            <button onClick={
                () => navigate( -1)
            }>
                go back

            </button>
        )


    }


    return (
        <div>
            <h1>Catalyst Homepage Preview</h1>
            <h2>{title}</h2>
            <div>
                <img src={articleImage} alt="article image" />
            </div>
            <div className=' mb-10 mt-16'>
                {paragraphs.map((paragraph, index) => {
                    return <p key={index}>{paragraph}</p>
                })}

            </div>
            
            <div>
                {backButton()}
            </div>

        </div>
    );
};

export default CatalystHomepagePreview;