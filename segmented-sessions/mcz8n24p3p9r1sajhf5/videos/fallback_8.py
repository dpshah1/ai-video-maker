from manim import *

class FallbackScene(Scene):
    def construct(self):
        # Title
        title = Text("Educational Content", font_size=36, color=BLUE)
        title.to_edge(UP)
        
        # Simple content representation
        content_text = Text("Content Loading...", font_size=24, color=WHITE)
        content_text.move_to(ORIGIN)
        
        # Decorative elements
        circle = Circle(radius=0.5, color=RED)
        circle.move_to(LEFT * 2)
        
        square = Square(side_length=1, color=GREEN)
        square.move_to(RIGHT * 2)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(0.5)
        self.play(Create(circle))
        self.wait(0.5)
        self.play(Create(square))
        self.wait(0.5)
        self.play(Write(content_text))
        self.wait(42.400000000000006)
        
        # Fade out
        self.play(FadeOut(title), FadeOut(circle), FadeOut(square), FadeOut(content_text))
        self.wait(0.5)