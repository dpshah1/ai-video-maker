from manim import *

class FallbackScene(Scene):
    def construct(self):
        # Simple fallback animation
        title = Text("Educational Content", font_size=36)
        title.to_edge(UP)
        
        circle = Circle(radius=0.5, color=BLUE)
        circle.move_to(ORIGIN)
        
        square = Square(side_length=1, color=RED)
        square.move_to(RIGHT * 2)
        
        self.play(Write(title))
        self.wait(0.5)
        self.play(Create(circle))
        self.wait(0.5)
        self.play(Create(square))
        self.wait(1)
        
        self.play(FadeOut(title), FadeOut(circle), FadeOut(square))
        self.wait(0.5)